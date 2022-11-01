package com.example.shop.domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
//@Table(name = "tbl_role")
public class Role {
	@Id
	@GeneratedValue
	private Long id;
	@Column(nullable = false)
	private String name;

//	@OneToMany(targetEntity = User.class, mappedBy = "role", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//	private Set<User> users = new HashSet();

	public Role() {
	}

	public Role(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

}